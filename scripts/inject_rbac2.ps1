# inject_rbac2.ps1 — robust RBAC injection using -SimpleMatch and line-index approach

$filePath = "g:\Workspace\Jayahana Project\src\app\page.tsx"
$lines = [System.IO.File]::ReadAllLines($filePath)
$total = $lines.Count
Write-Host "Loaded $total lines"

# ── STEP 1: Patch import line to add AppUser ──────────────────
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i].Contains('TaxCalculationDetail } from "@/types"')) {
    $lines[$i] = $lines[$i] -replace 'TaxCalculationDetail \} from "@/types"', 'TaxCalculationDetail, AppUser } from "@/types"'
    Write-Host "Step1: Patched import at line $($i+1)"
    break
  }
}

# ── STEP 2: Add RBAC lib imports after AccountingSuite import ──
$acctIdx = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i].Contains('AccountingSuite')) { $acctIdx = $i; break }
}
$alreadyHasRbac = $false
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i].Contains('from "@/lib/rbac"')) { $alreadyHasRbac = $true; break }
}
if ($acctIdx -ge 0 -and -not $alreadyHasRbac) {
  $rbacImports = @(
    'import { hasPermission, ROLE_LABELS, ROLE_COLORS, SEED_USERS, ROLE_PERMISSIONS } from "@/lib/rbac";',
    'import type { AppModule, AppAction } from "@/lib/rbac";'
  )
  $newLines = [System.Collections.Generic.List[string]]::new()
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $newLines.Add($lines[$i])
    if ($i -eq $acctIdx) {
      foreach ($imp in $rbacImports) { $newLines.Add($imp) }
    }
  }
  $lines = $newLines.ToArray()
  Write-Host "Step2: Added RBAC imports after line $($acctIdx+1)"
} else {
  Write-Host "Step2: RBAC imports already present or AccountingSuite not found"
}

# ── STEP 3: Add RBAC state after the first useState (activeTab) ──
$activeTabIdx = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i].Contains('"overview" | "requests" | "reports"') -or $lines[$i].Contains('"overview" | "requests" | "starlite"')) {
    $activeTabIdx = $i; break
  }
}
$alreadyHasState = $false
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i].Contains('currentUser')) { $alreadyHasState = $true; break }
}
if ($activeTabIdx -ge 0 -and -not $alreadyHasState) {
  $rbacState = @'
  // ══════════════════════════════════════════════════════════
  // AUTH & RBAC STATE
  // ══════════════════════════════════════════════════════════
  const [currentUser, setCurrentUser] = React.useState<AppUser | null>(null);
  const [isLoginOpen, setIsLoginOpen] = React.useState(true);
  const [loginUsername, setLoginUsername] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [loginError, setLoginError] = React.useState("");
  const [appUsers, setAppUsers] = React.useState<AppUser[]>(SEED_USERS);
  const [isUserMgmtOpen, setIsUserMgmtOpen] = React.useState(false);
  const [umSearch, setUmSearch] = React.useState("");
  const [umEditUser, setUmEditUser] = React.useState<AppUser | null>(null);
  const [umIsAddOpen, setUmIsAddOpen] = React.useState(false);
  const [umForm, setUmForm] = React.useState<Partial<AppUser & {passwordConfirm:string}>>({});

  const can = (module: AppModule, action: AppAction): boolean => {
    if (!currentUser) return false;
    return hasPermission(currentUser.role, module, action);
  };

  const handleLogin = () => {
    const user = appUsers.find(
      (u) => u.username === loginUsername.trim() && u.password === loginPassword && u.isActive
    );
    if (user) {
      setCurrentUser({ ...user, lastLogin: new Date().toISOString().split("T")[0] });
      setAppUsers(prev => prev.map(u => u.id === user.id ? { ...u, lastLogin: new Date().toISOString().split("T")[0] } : u));
      setIsLoginOpen(false);
      setLoginError("");
      setLoginPassword("");
    } else {
      setLoginError("Username atau password salah, atau akun tidak aktif.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoginOpen(true);
    setLoginUsername("");
    setLoginPassword("");
  };

'@
  $rbacStateLines = $rbacState -split "`n"
  $newLines = [System.Collections.Generic.List[string]]::new()
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $newLines.Add($lines[$i])
    if ($i -eq $activeTabIdx) {
      foreach ($sl in $rbacStateLines) { $newLines.Add($sl) }
    }
  }
  $lines = $newLines.ToArray()
  Write-Host "Step3: Injected RBAC state after line $($activeTabIdx+1)"
} else {
  Write-Host "Step3: State already present or activeTab line not found"
}

# ── STEP 4: Inject Login overlay right after the outer <div> in return() ──
# Find the return ( line, then find the first <div className="min-h-screen...
$returnIdx = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i].Contains('return (') -and $lines[$i].Trim() -eq 'return (') { $returnIdx = $i; break }
}
$alreadyHasLogin = $false
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i].Contains('isLoginOpen')) { $alreadyHasLogin = $true; break }
}
if ($returnIdx -ge 0 -and -not $alreadyHasLogin) {
  $minHIdx = -1
  for ($i = $returnIdx; $i -lt [Math]::Min($returnIdx+30, $lines.Count); $i++) {
    if ($lines[$i].Contains('min-h-screen')) { $minHIdx = $i; break }
  }
  if ($minHIdx -ge 0) {
    $loginBlock = @'
      {/* ════════ LOGIN SCREEN OVERLAY ════════ */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-6 text-white text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3 text-2xl font-black">J</div>
              <h1 className="text-lg font-bold tracking-tight">PT. Jayahana Manaura Mekanika Selaras</h1>
              <p className="text-xs text-blue-100 mt-1">ERP &amp; Billing System 2026</p>
            </div>
            <div className="px-8 py-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  placeholder="Contoh: admin"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {loginError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {loginError}
                </div>
              )}
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-lg transition"
              >
                Masuk ke Sistem
              </button>
              <p className="text-center text-xs text-slate-400 mt-2">
                Demo — <span className="font-mono font-semibold">admin</span> / <span className="font-mono font-semibold">admin2026</span>
              </p>
            </div>
          </div>
        </div>
      )}
'@
    $loginBlockLines = $loginBlock -split "`n"
    $newLines = [System.Collections.Generic.List[string]]::new()
    for ($i = 0; $i -lt $lines.Count; $i++) {
      $newLines.Add($lines[$i])
      if ($i -eq $minHIdx) {
        foreach ($ll in $loginBlockLines) { $newLines.Add($ll) }
      }
    }
    $lines = $newLines.ToArray()
    Write-Host "Step4: Injected Login overlay after line $($minHIdx+1)"
  }
} else {
  Write-Host "Step4: Login overlay already present or return() not found"
}

# ── STEP 5: Patch header button area — find and replace the two button <div> ──
# Find '+ Catat Pemasukan' by plain string search
$incomeLineIdx = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i].Contains('Catat Pemasukan')) { $incomeLineIdx = $i; break }
}
$alreadyHasUserInfo = $false
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i].Contains('handleLogout')) { $alreadyHasUserInfo = $true; break }
}
if ($incomeLineIdx -ge 0 -and -not $alreadyHasUserInfo) {
  # Walk backwards to find the opening <div className="flex items-center gap-2"> of this group
  $openDivIdx = -1
  for ($i = $incomeLineIdx - 1; $i -ge [Math]::Max(0, $incomeLineIdx-10); $i--) {
    if ($lines[$i].Contains('flex items-center gap-2')) { $openDivIdx = $i; break }
  }
  # Walk forward to find the 2nd closing </div>
  $closeDivIdx = -1
  $divCount = 0
  for ($i = $openDivIdx + 1; $i -lt [Math]::Min($openDivIdx+60, $lines.Count); $i++) {
    if ($lines[$i].Contains('</div>')) {
      $divCount++
      if ($divCount -ge 2) { $closeDivIdx = $i; break }
    }
  }
  if ($openDivIdx -ge 0 -and $closeDivIdx -ge 0) {
    $newHeaderBlock = @'
          <div className="flex items-center gap-2">
            {can("PENDAPATAN_AR","CREATE") && (
              <button
                onClick={() => setIsIncomeModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+ Catat Pemasukan</span>
              </button>
            )}
            {can("PENGAJUAN","CREATE") && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Pengajuan Dana</span>
              </button>
            )}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-slate-800 leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 leading-none mt-0.5">{ROLE_LABELS[currentUser.role]}</p>
                </div>
                {can("USER_MANAGEMENT","VIEW") && (
                  <button
                    onClick={() => setIsUserMgmtOpen(true)}
                    title="User Management"
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  title="Keluar"
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
'@
    $newHeaderLines = $newHeaderBlock -split "`n"
    $before = [System.Collections.Generic.List[string]]::new()
    for ($i = 0; $i -lt $openDivIdx; $i++) { $before.Add($lines[$i]) }
    $after = [System.Collections.Generic.List[string]]::new()
    for ($i = $closeDivIdx+1; $i -lt $lines.Count; $i++) { $after.Add($lines[$i]) }
    $combined = [System.Collections.Generic.List[string]]::new()
    $combined.AddRange($before)
    foreach ($hl in $newHeaderLines) { $combined.Add($hl) }
    $combined.AddRange($after)
    $lines = $combined.ToArray()
    Write-Host "Step5: Replaced header button block (lines $($openDivIdx+1)-$($closeDivIdx+1))"
  } else {
    Write-Host "Step5: Could not locate header button div boundaries"
  }
} else {
  Write-Host "Step5: Header user info already patched or Catat Pemasukan not found"
}

# ── STEP 6: Inject User Management + Add/Edit User Modals before the closing </> ──
$alreadyHasUMModal = $false
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i].Contains('isUserMgmtOpen &&')) { $alreadyHasUMModal = $true; break }
}
if (-not $alreadyHasUMModal) {
  # Find the PrintableDocumentModal closing /> 
  $printLine = -1
  for ($i = $lines.Count-1; $i -ge 0; $i--) {
    if ($lines[$i].Contains('PrintableDocumentModal')) { $printLine = $i; break }
  }
  $printClose = $printLine
  if ($printLine -ge 0) {
    for ($i = $printLine; $i -lt [Math]::Min($printLine+20, $lines.Count); $i++) {
      if ($lines[$i].TrimEnd() -eq '      />') { $printClose = $i; break }
    }
  }
  $umModal = @'

      {/* ═══ USER MANAGEMENT MODAL ═══ */}
      {isUserMgmtOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/40 backdrop-blur-sm pt-10 pb-6 px-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">User Management &amp; RBAC</h2>
                  <p className="text-xs text-slate-500">Kelola pengguna dan hak akses sistem</p>
                </div>
              </div>
              <button onClick={() => setIsUserMgmtOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg transition">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Search & Add */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={umSearch}
                    onChange={e => setUmSearch(e.target.value)}
                    placeholder="Cari nama, username, role, unit..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
                <button
                  onClick={() => { setUmForm({ isActive: true }); setUmEditUser(null); setUmIsAddOpen(true); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-pink-600 hover:bg-pink-700 transition"
                >
                  <Plus className="w-4 h-4" /> Tambah User
                </button>
              </div>
              {/* User Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">No</th>
                      <th className="px-4 py-3 text-left font-semibold">Nama Pengguna</th>
                      <th className="px-4 py-3 text-left font-semibold">Username</th>
                      <th className="px-4 py-3 text-left font-semibold">Role</th>
                      <th className="px-4 py-3 text-left font-semibold">Unit / Site</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">Login Terakhir</th>
                      <th className="px-4 py-3 text-center font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appUsers
                      .filter(u => {
                        if (!umSearch.trim()) return true;
                        const q = umSearch.toLowerCase();
                        return (
                          u.name.toLowerCase().includes(q) ||
                          u.username.toLowerCase().includes(q) ||
                          ROLE_LABELS[u.role].toLowerCase().includes(q) ||
                          u.unit.toLowerCase().includes(q)
                        );
                      })
                      .map((user, uIdx) => {
                        const rc = ROLE_COLORS[user.role];
                        return (
                          <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-slate-400">{uIdx + 1}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                                  {user.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900">{user.name}</p>
                                  <p className="text-slate-400 text-[10px]">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-600">{user.username}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${rc.bg} ${rc.text} ${rc.border}`}>
                                {ROLE_LABELS[user.role]}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">{user.unit}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => setAppUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u))}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition ${
                                  user.isActive
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                    : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                }`}
                              >
                                <CircleDot className="w-2.5 h-2.5" />
                                {user.isActive ? "Aktif" : "Nonaktif"}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{user.lastLogin ?? "—"}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => { setUmEditUser(user); setUmForm({ ...user }); setUmIsAddOpen(true); }}
                                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                                  title="Edit"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => { if (window.confirm("Hapus user " + user.name + "?")) setAppUsers(prev => prev.filter(u => u.id !== user.id)); }}
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* RBAC Permission Matrix */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-pink-600" />
                  Matriks Hak Akses (RBAC)
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-[10px]">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold sticky left-0 bg-slate-50">Modul</th>
                        {(["FIELD_TECH","SITE_SPV","PROCUREMENT","DIVISION_HEAD","INTERNAL_AUDIT","FINANCE_CASHIER","FINANCE_MANAGER","ACCOUNTING_TAX","DIRECTOR","SUPERADMIN"] as UserRole[]).map(role => {
                          const rc = ROLE_COLORS[role];
                          return (
                            <th key={role} className="px-2 py-2 text-center font-semibold">
                              <span className={`inline-block px-1.5 py-0.5 rounded-full border ${rc.bg} ${rc.text} ${rc.border} whitespace-nowrap`}>
                                {ROLE_LABELS[role]}
                              </span>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(["DASHBOARD","PENGAJUAN","PENCAIRAN","REALISASI","PENERIMAAN_BARANG","PENDAPATAN_AR","BUKU_BESAR","USER_MANAGEMENT"] as AppModule[]).map(mod => (
                        <tr key={mod} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-semibold text-slate-700 whitespace-nowrap sticky left-0 bg-white">{mod.replace(/_/g," ")}</td>
                          {(["FIELD_TECH","SITE_SPV","PROCUREMENT","DIVISION_HEAD","INTERNAL_AUDIT","FINANCE_CASHIER","FINANCE_MANAGER","ACCOUNTING_TAX","DIRECTOR","SUPERADMIN"] as UserRole[]).map(role => {
                            const perms = ROLE_PERMISSIONS[role].find((p: {module: AppModule; actions: AppAction[]}) => p.module === mod);
                            return (
                              <td key={role} className="px-2 py-2 text-center">
                                {perms ? (
                                  <span className="text-emerald-600 font-semibold">{perms.actions.join(" · ")}</span>
                                ) : (
                                  <span className="text-slate-300">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ADD / EDIT USER MODAL ═══ */}
      {umIsAddOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-slate-900">{umEditUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}</h3>
              <button
                onClick={() => { setUmIsAddOpen(false); setUmEditUser(null); setUmForm({}); }}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={umForm.name ?? ""}
                  onChange={e => setUmForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Contoh: Ahmad Fauzi"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  value={umForm.email ?? ""}
                  onChange={e => setUmForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="nama@jayahana.co.id"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Username <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={umForm.username ?? ""}
                  onChange={e => setUmForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="nama.pengguna"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Role <span className="text-red-500">*</span></label>
                <select
                  value={umForm.role ?? ""}
                  onChange={e => setUmForm(f => ({ ...f, role: e.target.value as UserRole }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="">— Pilih Role —</option>
                  {(Object.keys(ROLE_LABELS) as UserRole[]).map(r => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Unit / Site <span className="text-red-500">*</span></label>
                <select
                  value={umForm.unit ?? ""}
                  onChange={e => setUmForm(f => ({ ...f, unit: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="">— Pilih Unit —</option>
                  {SITE_DIVISIONS.map((d: string) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Password {umEditUser && <span className="text-slate-400 font-normal">(kosongkan jika tidak diubah)</span>}
                </label>
                <input
                  type="password"
                  value={umForm.password ?? ""}
                  onChange={e => setUmForm(f => ({ ...f, password: e.target.value }))}
                  placeholder={umEditUser ? "••••••• (opsional)" : "Password baru"}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="umActive"
                  checked={umForm.isActive ?? true}
                  onChange={e => setUmForm(f => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-pink-600"
                />
                <label htmlFor="umActive" className="text-sm text-slate-700">Akun Aktif</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setUmIsAddOpen(false); setUmEditUser(null); setUmForm({}); }}
                  className="flex-1 py-2 text-sm font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (!umForm.name || !umForm.username || !umForm.role || !umForm.unit) {
                      alert("Nama, Username, Role, dan Unit wajib diisi!");
                      return;
                    }
                    if (umEditUser) {
                      setAppUsers(prev => prev.map(u => u.id === umEditUser.id ? {
                        ...u,
                        name: umForm.name ?? u.name,
                        email: umForm.email ?? u.email,
                        username: umForm.username ?? u.username,
                        role: (umForm.role ?? u.role) as UserRole,
                        unit: umForm.unit ?? u.unit,
                        isActive: umForm.isActive ?? u.isActive,
                        ...(umForm.password ? { password: umForm.password } : {}),
                      } : u));
                    } else {
                      const newUser: AppUser = {
                        id: "u-" + Date.now(),
                        name: umForm.name ?? "",
                        email: umForm.email ?? "",
                        username: umForm.username ?? "",
                        password: umForm.password ?? "jayahana123",
                        role: (umForm.role ?? "FIELD_TECH") as UserRole,
                        unit: umForm.unit ?? "",
                        isActive: umForm.isActive ?? true,
                        createdAt: new Date().toISOString().split("T")[0],
                      };
                      setAppUsers(prev => [...prev, newUser]);
                    }
                    setUmIsAddOpen(false);
                    setUmEditUser(null);
                    setUmForm({});
                  }}
                  className="flex-1 py-2 text-sm font-semibold rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition"
                >
                  {umEditUser ? "Simpan Perubahan" : "Tambah Pengguna"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
'@
  $umModalLines = $umModal -split "`n"
  $insertAfter = $printClose
  $newLines = [System.Collections.Generic.List[string]]::new()
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $newLines.Add($lines[$i])
    if ($i -eq $insertAfter) {
      foreach ($ml in $umModalLines) { $newLines.Add($ml) }
    }
  }
  $lines = $newLines.ToArray()
  Write-Host "Step6: Injected User Management modal after line $($insertAfter+1)"
} else {
  Write-Host "Step6: User Management modal already present"
}

# ── SAVE ─────────────────────────────────────────────────────
[System.IO.File]::WriteAllLines($filePath, $lines, [System.Text.UTF8Encoding]::new($false))
Write-Host "Saved! Total lines: $($lines.Count)"
