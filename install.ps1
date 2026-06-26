# SpecLoom installer (Windows)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
& node "$Root\scripts\install.mjs" @args
