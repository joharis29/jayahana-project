# inject_rbac.ps1
# Injects RBAC state, Login modal, User Management tab, and permission guards into page.tsx

$filePath = "g:\Workspace\Jayahana Project\src\app\page.tsx"
$lines = Get-Content $filePath -Encoding UTF8

Write-Host "File has $($lines.Count) lines"

# ─────────────────────────────────────────────────────────────
# STEP 1: Patch the import line to add AppUser
# ─────────────────────────────────────────────────────────────
$importLine = $lines | Select-String 'from "@/types"' | Select-Object -First 1
if ($importLine) {
  $idx = $importLine.LineNumber - 1
  $old = $lines[$idx]
  if ($old -notmatch 'AppUser') {
    $lines[$idx] = $old -replace 'from "@/types"', 'AppUser } from "@/types"; import { hasPermission, ROLE_PERMISSIONS, ROLE_LABELS, ROLE_COLORS, SEED_USERS } from "@/lib/rbac"; import type { AppModule, AppAction } from "@/lib/rbac"; // RBAC end // ignore {'
    # Cleaner replacement:
    $lines[$idx] = $old.TrimEnd() -replace 'TaxCalculationDetail \} from "@/types"', 'TaxCalculationDetail, AppUser } from "@/types"'
    Write-Host "Patched import line $($idx+1)"
  } else {
    Write-Host "AppUser already in imports"
  }
}

# ─────────────────────────────────────────────────────────────
# STEP 2: Add RBAC import after existing imports (after AccountingSuite line)
# ─────────────────────────────────────────────────────────────
$acctLine = $lines | Select-String 'import.*AccountingSuite' | Select-Object -First 1
if ($acctLine) {
  $idx = $acctLine.LineNumber - 1
  $rbacImport = 'import { hasPermission, ROLE_LABELS, ROLE_COLORS, SEED_USERS } from "@/lib/rbac";'
  $rbacImport2 = 'import type { AppModule, AppAction } from "@/lib/rbac";'
  if (-not ($lines -match 'from "@/lib/rbac"')) {
    $newLines = @()
    for ($i = 0; $i -lt $lines.Count; $i++) {
      $newLines += $lines[$i]
      if ($i -eq $idx) {
        $newLines += $rbacImport
        $newLines += $rbacImport2
      }
    }
    $lines = $newLines
    Write-Host "Injected RBAC imports after line $($idx+1)"
  } else {
    Write-Host "RBAC imports already present"
  }
}

# ─────────────────────────────────────────────────────────────
# STEP 3: Add RBAC state variables after the first useState (activeTab)
# ─────────────────────────────────────────────────────────────
$activeTabLine = $lines | Select-String 'useState<"overview"' | Select-Object -First 1
if ($activeTabLine) {
  $idx = $activeTabLine.LineNumber - 1
  if (-not ($lines -match 'currentUser')) {
    $rbacState = @'

  // ══════════════════════════════════════════════════════════
  // AUTH & RBAC STATE
  // ══════════════════════════════════════════════════════════
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [appUsers, setAppUsers] = useState<AppUser[]>(SEED_USERS);
  const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(false);
  // User Management form state
  const [umSearch, setUmSearch] = useState("");
  const [umEditUser, setUmEditUser] = useState<AppUser | null>(null);
  const [umIsAddOpen, setUmIsAddOpen] = useState(false);
  const [umForm, setUmForm] = useState<Partial<AppUser & {passwordConfirm:string}>>({});

  // Permission helper (curried on currentUser)
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
    $newLines = @()
    for ($i = 0; $i -lt $lines.Count; $i++) {
      $newLines += $lines[$i]
      if ($i -eq $idx) {
        $newLines += $rbacState
      }
    }
    $lines = $newLines
    Write-Host "Injected RBAC state after line $($idx+1)"
  } else {
    Write-Host "RBAC state already present"
  }
}

# ─────────────────────────────────────────────────────────────
# STEP 4: Find the return ( line (first occurrence) and inject Login overlay
# ─────────────────────────────────────────────────────────────
$returnLine = $lines | Select-String '^\s+return \(' | Select-Object -First 1
if ($returnLine) {
  $idx = $returnLine.LineNumber  # line AFTER 'return ('
  if (-not ($lines -match 'isLoginOpen')) {
    # We'll insert the login overlay at the top of the JSX (after <div className="min-h-screen...)
    $divLine = $null
    for ($i = $idx; $i -lt [Math]::Min($idx+20, $lines.Count); $i++) {
      if ($lines[$i] -match 'min-h-screen') {
        $divLine = $i
        break
      }
    }
    if ($divLine -ne $null) {
      $loginOverlay = @'
      {/* ════════ LOGIN OVERLAY ════════ */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-6 text-white text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3 text-2xl font-black">J</div>
              <h1 className="text-lg font-bold tracking-tight">PT. Jayahana Manaura Mekanika Selaras</h1>
              <p className="text-xs text-blue-100 mt-1">ERP & Billing System 2026</p>
            </div>
            {/* Body */}
            <div className="px-8 py-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
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
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
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
              <p className="text-center text-xs text-slate-400">Demo: <span className="font-mono">admin</span> / <span className="font-mono">admin2026</span></p>
            </div>
          </div>
        </div>
      )}
'@
      $newLines = @()
      for ($i = 0; $i -lt $lines.Count; $i++) {
        $newLines += $lines[$i]
        if ($i -eq $divLine) {
          $newLines += $loginOverlay
        }
      }
      $lines = $newLines
      Write-Host "Injected Login overlay after line $($divLine+1)"
    }
  } else {
    Write-Host "Login overlay already present"
  }
}

# ─────────────────────────────────────────────────────────────
# STEP 5: Patch the header user area — replace the static button group with dynamic user info
# ─────────────────────────────────────────────────────────────
$headerBtn = $lines | Select-String '+ Catat Pemasukan' | Select-Object -First 1
if ($headerBtn) {
  $startIdx = $headerBtn.LineNumber - 1
  # Find the closing </div> of the header button group (walk forward ~20 lines)
  $endIdx = $startIdx
  for ($i = $startIdx; $i -lt [Math]::Min($startIdx+30, $lines.Count); $i++) {
    if ($lines[$i] -match '^\s+</div>\s*$') {
      # Look ahead to see if next non-empty is also </div> (the outer flex div)
      $endIdx = $i
      break
    }
  }

  if (-not ($lines -match 'handleLogout')) {
    $userInfoBlock = @'
          {/* ── User Info & Logout ── */}
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
    # Find exact block to replace: from the flex items-center gap-2 that wraps the two buttons
    # Locate the line with 'flex items-center gap-2' that immediately precedes '+ Catat Pemasukan'
    $flexLine = $null
    for ($i = $startIdx - 5; $i -le $startIdx; $i++) {
      if ($i -ge 0 -and $lines[$i] -match 'flex items-center gap-2') {
        $flexLine = $i
        break
      }
    }
    if ($flexLine -ne $null) {
      # Count lines to replace: from $flexLine to the closing </div> that wraps both buttons
      # We need to find the 2nd </div> after the flex div
      $closingCount = 0
      $closeIdx = $flexLine
      for ($i = $flexLine + 1; $i -lt [Math]::Min($flexLine+40, $lines.Count); $i++) {
        if ($lines[$i] -match '^\s+</div>') {
          $closingCount++
        }
        if ($closingCount -eq 2) {
          $closeIdx = $i
          break
        }
      }
      # Replace lines from $flexLine to $closeIdx with the new block
      $before = $lines[0..($flexLine-1)]
      $after = $lines[($closeIdx+1)..($lines.Count-1)]
      $lines = $before + @($userInfoBlock) + $after
      Write-Host "Replaced header user area from line $($flexLine+1) to $($closeIdx+1)"
    }
  } else {
    Write-Host "Header user area already patched"
  }
}

# ─────────────────────────────────────────────────────────────
# STEP 6: Add "User Management" tab to the navigation
# ─────────────────────────────────────────────────────────────
$reportsTabLine = $lines | Select-String 'Buku Besar.*Siklus Akuntansi' | Select-Object -First 1
if ($reportsTabLine) {
  $idx = $reportsTabLine.LineNumber - 1
  # Find the end of this button (closing </button>)
  $endBtnIdx = $idx
  for ($i = $idx; $i -lt [Math]::Min($idx+20, $lines.Count); $i++) {
    if ($lines[$i] -match '</button>') {
      $endBtnIdx = $i
      break
    }
  }
  if (-not ($lines -match 'USER_MANAGEMENT\|User Management')) {
    $userMgmtTab = @'

          {can("USER_MANAGEMENT","VIEW") && (
            <button
              onClick={() => setIsUserMgmtOpen(true)}
              className="py-3 px-3.5 border-b-2 border-transparent flex items-center gap-2 whitespace-nowrap transition-colors text-slate-600 hover:text-slate-900"
            >
              <Users className="w-4 h-4 text-pink-600" />
              User Management
            </button>
          )}
'@
    $newLines = @()
    for ($i = 0; $i -lt $lines.Count; $i++) {
      $newLines += $lines[$i]
      if ($i -eq $endBtnIdx) {
        $newLines += $userMgmtTab
      }
    }
    $lines = $newLines
    Write-Host "Injected User Management tab after line $($endBtnIdx+1)"
  } else {
    Write-Host "User Management tab already present"
  }
}

# ─────────────────────────────────────────────────────────────
# STEP 7: Inject User Management Modal + RBAC Matrix Modal
# Find the last </> or closing of main content, inject before it
# ─────────────────────────────────────────────────────────────
# Find the PrintableDocumentModal usage line (last major modal) and inject after it
$printModalLine = $lines | Select-String 'isPrintModalOpen' | Select-Object -Last 1
if ($printModalLine) {
  $idx = $printModalLine.LineNumber - 1
  # Find its closing /> or })} 
  $endIdx = $idx
  for ($i = $idx; $i -lt [Math]::Min($idx+20, $lines.Count); $i++) {
    if ($lines[$i] -match '/>' -or $lines[$i] -match '^\s+\}\)') {
      $endIdx = $i
      break
    }
  }
  
  if (-not ($lines -match 'isUserMgmtOpen &&')) {
    $userMgmtModal = @'

      {/* ══════════════════════════════════════════════════════════════
          USER MANAGEMENT MODAL
      ══════════════════════════════════════════════════════════════ */}
      {isUserMgmtOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/40 backdrop-blur-sm pt-10 pb-6 px-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">User Management & RBAC</h2>
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
                    placeholder="Cari nama, username, role..."
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
                      <th className="px-4 py-3 text-left font-semibold">Nama</th>
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
                        return u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || ROLE_LABELS[u.role].toLowerCase().includes(q) || u.unit.toLowerCase().includes(q);
                      })
                      .map((user, idx) => {
                        const rc = ROLE_COLORS[user.role];
                        return (
                          <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-3 font-semibold text-slate-900">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                  {user.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900">{user.name}</p>
                                  <p className="text-slate-400 text-[10px]">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-700">{user.username}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${rc.bg} ${rc.text} ${rc.border}`}>
                                {ROLE_LABELS[user.role]}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{user.unit}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => setAppUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u))}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition ${user.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'}`}
                              >
                                <CircleDot className="w-2.5 h-2.5" />
                                {user.isActive ? 'Aktif' : 'Nonaktif'}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{user.lastLogin ?? '-'}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => { setUmEditUser(user); setUmForm({ ...user, passwordConfirm: user.password }); setUmIsAddOpen(true); }}
                                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                                  title="Edit"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => { if (window.confirm(`Hapus user ${user.name}?`)) setAppUsers(prev => prev.filter(u => u.id !== user.id)); }}
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
                    {appUsers.filter(u => !umSearch.trim() || u.name.toLowerCase().includes(umSearch.toLowerCase()) || u.username.toLowerCase().includes(umSearch.toLowerCase())).length === 0 && (
                      <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">Tidak ada pengguna ditemukan.</td></tr>
                    )}
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
                        <th className="px-3 py-2 text-left font-semibold">Modul</th>
                        {(["FIELD_TECH","SITE_SPV","PROCUREMENT","DIVISION_HEAD","INTERNAL_AUDIT","FINANCE_CASHIER","FINANCE_MANAGER","ACCOUNTING_TAX","DIRECTOR","SUPERADMIN"] as UserRole[]).map(role => {
                          const rc = ROLE_COLORS[role];
                          return (
                            <th key={role} className="px-2 py-2 text-center font-semibold">
                              <span className={`inline-block px-1.5 py-0.5 rounded-full border ${rc.bg} ${rc.text} ${rc.border}`}>{ROLE_LABELS[role]}</span>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(["DASHBOARD","PENGAJUAN","PENCAIRAN","REALISASI","PENERIMAAN_BARANG","PENDAPATAN_AR","BUKU_BESAR","USER_MANAGEMENT"] as AppModule[]).map(mod => (
                        <tr key={mod} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-semibold text-slate-700 whitespace-nowrap">{mod.replace(/_/g,' ')}</td>
                          {(["FIELD_TECH","SITE_SPV","PROCUREMENT","DIVISION_HEAD","INTERNAL_AUDIT","FINANCE_CASHIER","FINANCE_MANAGER","ACCOUNTING_TAX","DIRECTOR","SUPERADMIN"] as UserRole[]).map(role => {
                            const perms = ROLE_PERMISSIONS[role].find(p => p.module === mod);
                            return (
                              <td key={role} className="px-2 py-2 text-center">
                                {perms ? (
                                  <span className="text-emerald-600 font-semibold text-[10px]">{perms.actions.join(' · ')}</span>
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

      {/* ══════ ADD / EDIT USER MODAL ══════ */}
      {umIsAddOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-slate-900">{umEditUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h3>
              <button onClick={() => { setUmIsAddOpen(false); setUmEditUser(null); setUmForm({}); }} className="p-2 hover:bg-slate-100 rounded-lg transition">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Nama Lengkap', key: 'name', placeholder: 'Contoh: Ahmad Fauzi', type: 'text' },
                { label: 'Email', key: 'email', placeholder: 'nama@jayahana.co.id', type: 'email' },
                { label: 'Username', key: 'username', placeholder: 'nama.pengguna', type: 'text' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                  <input
                    type={type}
                    value={(umForm as Record<string, string>)[key] ?? ''}
                    onChange={e => setUmForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Role</label>
                <select
                  value={umForm.role ?? ''}
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
                <label className="block text-xs font-semibold text-slate-600 mb-1">Unit / Site</label>
                <select
                  value={umForm.unit ?? ''}
                  onChange={e => setUmForm(f => ({ ...f, unit: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="">— Pilih Unit —</option>
                  {SITE_DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                <input
                  type="password"
                  value={umForm.password ?? ''}
                  onChange={e => setUmForm(f => ({ ...f, password: e.target.value }))}
                  placeholder={umEditUser ? 'Kosongkan jika tidak diubah' : 'Password baru'}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div className="flex items-center gap-2">
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
                      alert('Nama, Username, Role, dan Unit wajib diisi!');
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
                        id: `u-${Date.now()}`,
                        name: umForm.name ?? '',
                        email: umForm.email ?? '',
                        username: umForm.username ?? '',
                        password: umForm.password ?? 'jayahana123',
                        role: (umForm.role ?? 'FIELD_TECH') as UserRole,
                        unit: umForm.unit ?? '',
                        isActive: umForm.isActive ?? true,
                        createdAt: new Date().toISOString().split('T')[0],
                      };
                      setAppUsers(prev => [...prev, newUser]);
                    }
                    setUmIsAddOpen(false);
                    setUmEditUser(null);
                    setUmForm({});
                  }}
                  className="flex-1 py-2 text-sm font-semibold rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition"
                >
                  {umEditUser ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
'@
    $newLines = @()
    for ($i = 0; $i -lt $lines.Count; $i++) {
      $newLines += $lines[$i]
      if ($i -eq $endIdx) {
        $newLines += $userMgmtModal
      }
    }
    $lines = $newLines
    Write-Host "Injected User Management modal after line $($endIdx+1)"
  } else {
    Write-Host "User Management modal already present"
  }
}

# ─────────────────────────────────────────────────────────────
# STEP 8: Add AppModule import to the type import at RBAC section
# ─────────────────────────────────────────────────────────────
# Already handled by the RBAC import block above

# ─────────────────────────────────────────────────────────────
# STEP 9: Write the patched file
# ─────────────────────────────────────────────────────────────
$lines | Set-Content $filePath -Encoding UTF8
Write-Host "Done! File saved with $($lines.Count) lines."
