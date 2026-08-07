export const meta = {
  name: 'specloom-run-set',
  description: 'Execute a SpecLoom run_set: per Brief, Implementation gate then Tester gate, stacked PRs, deterministic budgets',
  whenToUse: 'Launched by the main thread after PM returns a run_set of Ready Briefs. Never self-launched by an agent.',
  phases: [
    { title: 'Implement', detail: 'gate 1 per Brief — code + secrets scan' },
    { title: 'Test', detail: 'gate 2 per Brief — criteria to assertions, coverage ratchet' },
    { title: 'Stack', detail: 'commit and stacked PR per green Brief' },
    { title: 'Cleanup', detail: 'draft + comment PRs when a set fails' },
  ],
}

// args: {
//   runSet: [{ key, taskSpec, size: 'small'|'standard', visual: bool, imageFiles: [], base? }],
//   coverageFloor: 0.90, tokenBudgetPerBrief: 250000, trunk: 'ai-workflow'
// }
// Contract: specloom-contract. Attempts: impl 3, tester 3, brief total 5.
// Same (file,rule) failing 3x stops the gate early. Sequential Briefs, stacked branches.

// Some launch paths hand args through as a JSON string rather than an object
// (observed 2026-08-07, GH-24 run). Normalize before any use — do not remove.
const A = typeof args === 'string' ? JSON.parse(args) : args

const IMPL_ATTEMPTS = 3
const TEST_ATTEMPTS = 3
const BRIEF_ATTEMPTS = 5
const TOKEN_BUDGET = (A && A.tokenBudgetPerBrief) || 250000
const TRUNK = (A && A.trunk) || 'ai-workflow'
const FLOOR = (A && A.coverageFloor) || 0.9

const FINDING = {
  type: 'object',
  properties: {
    severity: { enum: ['critical', 'major', 'minor'] },
    gate: { enum: ['implementation', 'tester'] },
    owner: { enum: ['build', 'test'] },
    file: { type: 'string' },
    line: { type: ['integer', 'null'] },
    issue: { type: 'string' },
    rule: { type: 'string' },
    source: { type: 'string' },
    remediation: { type: 'string' },
  },
  required: ['severity', 'owner', 'file', 'issue', 'rule', 'source', 'remediation'],
}

const IMPL_SCHEMA = {
  type: 'object',
  properties: {
    state: { enum: ['green', 'red'] },
    fast: { type: 'boolean' },
    layers: { type: 'array', items: { type: 'string' } },
    changes: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, what: { type: 'string' } }, required: ['file', 'what'] } },
    cmds: { type: 'array', items: { type: 'object', properties: { cmd: { type: 'string' }, exit: { type: 'integer' } }, required: ['cmd', 'exit'] } },
    secrets: { type: 'object', properties: { added_lines_scanned: { type: 'integer' }, high: { type: 'integer' }, critical: { type: 'integer' } }, required: ['high', 'critical'] },
    suite: { type: ['object', 'null'] },
    findings: { type: 'array', items: FINDING },
    open_questions: { type: 'array', items: { type: 'string' } },
  },
  required: ['state', 'changes', 'cmds', 'secrets', 'findings'],
}

const TEST_SCHEMA = {
  type: 'object',
  properties: {
    state: { enum: ['green', 'red'] },
    suite: { type: 'object', properties: { cmd: { type: 'string' }, exit: { type: 'integer' }, passed: { type: 'integer' }, failed: { type: 'integer' } }, required: ['exit', 'passed', 'failed'] },
    coverage: { type: 'object', properties: { percent: { type: 'number' }, floor: { type: 'number' }, new_floor: { type: ['number', 'null'] }, uncovered_files: { type: 'array', items: { type: 'string' } } }, required: ['percent', 'floor'] },
    visual_results: { type: 'array' },
    findings: { type: 'array', items: FINDING },
  },
  required: ['state', 'suite', 'coverage', 'findings'],
}

const REPO_SCHEMA = {
  type: 'object',
  properties: {
    state: { enum: ['ok', 'failed'] },
    branch: { type: 'string' },
    pr: { type: ['string', 'null'] },
    detail: { type: 'string' },
  },
  required: ['state', 'detail'],
}

const blocking = (fs) => fs.filter((f) => f.severity === 'critical' || f.severity === 'major')
const findingKey = (f) => `${f.file}::${f.rule}`

function handoff(type, brief, extra) {
  return JSON.stringify({ type, from: 'specloom-run-set', brief: brief.key, task_spec: brief.taskSpec, ...extra })
}

if (!A || !Array.isArray(A.runSet) || A.runSet.length === 0) {
  throw new Error('specloom-run-set requires args.runSet: [{ key, taskSpec, ... }]')
}

const results = []
let failed = null
let prevBranch = null

for (let i = 0; i < A.runSet.length; i++) {
  const brief = A.runSet[i]
  const base = brief.base || prevBranch || TRUNK
  const workBranch = `specloom/${brief.key}`
  const briefStartSpend = budget.spent()
  const spentThisBrief = () => budget.spent() - briefStartSpend
  const record = { key: brief.key, branch: workBranch, base, attempts: { implementation: 0, tester: 0 }, gates: {}, state: 'pending' }
  results.push(record)

  log(`Brief ${i + 1}/${A.runSet.length}: ${brief.key} (${brief.size || 'standard'}) on ${workBranch} from ${base}`)

  if (brief.visual && (!brief.imageFiles || brief.imageFiles.length === 0)) {
    failed = { brief: brief.key, stuck_gate: 'implementation', reason: 'ux_refs_missing', findings: [] }
    record.state = 'failed'
    break
  }

  const fast = brief.size === 'small'
  const failCounts = {}
  let remediation = []
  let impl = null
  let test = null
  let briefAttempts = 0
  let stopReason = null

  // Gate 1 — Implementation (fast mode also carries the tests)
  while (record.attempts.implementation < IMPL_ATTEMPTS && briefAttempts < BRIEF_ATTEMPTS) {
    if (spentThisBrief() > TOKEN_BUDGET) { stopReason = 'budget'; break }
    record.attempts.implementation++
    briefAttempts++
    impl = await agent(
      `${handoff('IMPLEMENTATION_HANDOFF', brief, { base, work_branch: workBranch, fast, attempt: record.attempts.implementation, remediation })}\n\n` +
        `You are the Implementation gate for Brief ${brief.key}. Work on branch ${workBranch} (create from ${base} if missing). ` +
        `Follow your agent instructions. ${fast ? 'FAST MODE: also write the tests and run the suite green.' : ''} ` +
        `${remediation.length ? 'This is a retry — change only what the remediation findings name.' : ''}`,
      { agentType: 'specloom-implementation', label: `impl:${brief.key}#${record.attempts.implementation}`, phase: 'Implement', schema: IMPL_SCHEMA },
    )
    if (!impl) { stopReason = 'agent_error'; break }
    const blockers = blocking(impl.findings)
    const secretsRed = impl.secrets.high > 0 || impl.secrets.critical > 0
    if (impl.state === 'green' && blockers.length === 0 && !secretsRed) break
    const fresh = []
    for (const f of blockers) {
      const k = findingKey(f)
      failCounts[k] = (failCounts[k] || 0) + 1
      if (failCounts[k] >= 3) stopReason = 'repeat_finding'
      fresh.push({ ...f, repeat: failCounts[k] > 1 })
    }
    remediation = fresh.filter((f) => f.owner === 'build')
    if (stopReason) break
    impl = null
  }
  record.gates.implementation = impl ? { state: impl.state, findings: impl.findings } : { state: 'red' }

  if (!impl || impl.state !== 'green') {
    failed = { brief: brief.key, stuck_gate: 'implementation', reason: stopReason || 'gate_attempts', attempts: record.attempts, findings: remediation }
    record.state = 'failed'
    break
  }

  // Gate 2 — Tester (skipped on the fast path)
  if (!fast) {
    remediation = []
    while (record.attempts.tester < TEST_ATTEMPTS && briefAttempts < BRIEF_ATTEMPTS) {
      if (spentThisBrief() > TOKEN_BUDGET) { stopReason = 'budget'; break }
      record.attempts.tester++
      briefAttempts++
      test = await agent(
        `${handoff('TESTER_HANDOFF', brief, { work_branch: workBranch, coverage_floor: FLOOR, attempt: record.attempts.tester, remediation })}\n\n` +
          `You are the Tester gate for Brief ${brief.key} on branch ${workBranch}. Follow your agent instructions.`,
        { agentType: 'specloom-tester', label: `test:${brief.key}#${record.attempts.tester}`, phase: 'Test', schema: TEST_SCHEMA },
      )
      if (!test) { stopReason = 'agent_error'; break }
      const blockers = blocking(test.findings)
      if (test.state === 'green' && blockers.length === 0) break
      const buildOwned = blockers.filter((f) => f.owner === 'build')
      for (const f of blockers) {
        const k = findingKey(f)
        failCounts[k] = (failCounts[k] || 0) + 1
        if (failCounts[k] >= 3) stopReason = 'repeat_finding'
      }
      if (stopReason) break
      if (buildOwned.length && record.attempts.implementation < IMPL_ATTEMPTS && briefAttempts < BRIEF_ATTEMPTS) {
        record.attempts.implementation++
        briefAttempts++
        const fix = await agent(
          `${handoff('IMPLEMENTATION_HANDOFF', brief, { base, work_branch: workBranch, fast: false, attempt: record.attempts.implementation, remediation: buildOwned })}\n\n` +
            `Retry: the Tester found production defects. Change only what the remediation findings name.`,
          { agentType: 'specloom-implementation', label: `impl-fix:${brief.key}#${record.attempts.implementation}`, phase: 'Implement', schema: IMPL_SCHEMA },
        )
        if (!fix || fix.state !== 'green' || fix.secrets.high > 0 || fix.secrets.critical > 0) { stopReason = 'gate_attempts'; break }
      }
      remediation = blockers.filter((f) => f.owner === 'test')
      test = null
    }
    record.gates.tester = test ? { state: test.state, coverage: test.coverage } : { state: 'red' }
    if (!test || test.state !== 'green') {
      failed = { brief: brief.key, stuck_gate: 'tester', reason: stopReason || 'gate_attempts', attempts: record.attempts, findings: remediation }
      record.state = 'failed'
      break
    }
  } else {
    record.gates.tester = { state: 'skipped', reason: 'fast_path' }
  }

  // Stack — commit and open/update the stacked PR
  const stacked = await agent(
    `REPOSITORY_HANDOFF ${JSON.stringify({ op: 'commit_and_stack', brief: brief.key, work_branch: workBranch, base, stack_position: `${i + 1} of ${A.runSet.length}` })}\n` +
      `Commit the work on ${workBranch} and open or update its stacked PR (base: ${base}). Do NOT merge_stack.`,
    { agentType: 'specloom-repository', label: `stack:${brief.key}`, phase: 'Stack', schema: REPO_SCHEMA },
  )
  if (!stacked || stacked.state !== 'ok') {
    failed = { brief: brief.key, stuck_gate: 'repository', reason: 'stack_failed', detail: stacked ? stacked.detail : 'agent_error', findings: [] }
    record.state = 'failed'
    break
  }
  record.pr = stacked.pr
  record.state = 'green'
  prevBranch = workBranch
  log(`${brief.key} green — PR ${stacked.pr || '(updated)'} · impl x${record.attempts.implementation}, test x${record.attempts.tester}`)
}

if (failed) {
  const greens = results.filter((r) => r.state === 'green').map((r) => r.key)
  await agent(
    `REPOSITORY_HANDOFF ${JSON.stringify({ op: 'cleanup_failed_set', failed_brief: failed.brief, stuck_gate: failed.stuck_gate, reason: failed.reason, green_briefs: greens })}\n` +
      `The run_set failed at ${failed.brief} (${failed.stuck_gate}: ${failed.reason}). Keep the failed work branch pushed; convert its PR to draft with a comment naming the stuck gate and findings; ` +
      `comment on earlier green Briefs' PRs that they are blocked by ${failed.brief}. Touch nothing on ${TRUNK}.`,
    { agentType: 'specloom-repository', label: 'cleanup', phase: 'Cleanup', schema: REPO_SCHEMA },
  )
  log(`FAILED at ${failed.brief} (${failed.stuck_gate}: ${failed.reason}) — ${greens.length} earlier Brief(s) green and blocked`)
  return { state: 'FAILED', ...failed, briefs: results }
}

log(`SUCCESS — ${results.length} Brief(s) green and stacked. Main thread: Task Repository merge_stack, then PM Done + promote, then Document closeout.`)
return { state: 'SUCCESS', briefs: results }
