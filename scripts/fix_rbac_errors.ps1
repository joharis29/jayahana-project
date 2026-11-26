# fix_rbac_errors.ps1 — Fix the duplicate UM modal and stray )} in page.tsx

$filePath = "g:\Workspace\Jayahana Project\src\app\page.tsx"
$lines = [System.IO.File]::ReadAllLines($filePath)
Write-Host "Loaded $($lines.Count) lines"

# Find all occurrences of isUserMgmtOpen &&
$umIdxList = @()
for ($i = 0; $i -lt $lines.Count; $i++) {
  if ($lines[$i] -match 'isUserMgmtOpen &&') { $umIdxList += $i }
}
Write-Host "Found isUserMgmtOpen && at lines: $($umIdxList | ForEach-Object { $_ + 1 })"

# If there are 2+ occurrences in JSX (not counting state declaration), we need to remove one
# Lines: 113 (state), 2735 (button click), 8276 (1st modal), 8290 (2nd modal)
# We want to keep only one full modal. Remove from 8276 to just before 8290's block start
# But first let's find the FIRST duplicate modal end

if ($umIdxList.Count -ge 4) {
  # 4 occurrences means: state, button, modal-1, modal-2
  # We want to remove modal-1 (at index umIdxList[2]) through just before modal-2 (umIdxList[3])
  # But actually modal-1 starts at umIdxList[2] and ends somewhere before umIdxList[3]
  # Let's find the closing )} of the first modal
  
  $modal1Start = $umIdxList[2]
  $modal1End = $umIdxList[3] - 1
  
  # Walk backwards from modal2 start to find first )} 
  for ($i = $umIdxList[3] - 1; $i -gt $modal1Start; $i--) {
    if ($lines[$i].Trim() -eq ')}') {
      $modal1End = $i
      break
    }
  }
  
  Write-Host "Removing duplicate first modal block from line $($modal1Start+1) to $($modal1End+1)"
  
  $newLines = [System.Collections.Generic.List[string]]::new()
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($i -ge $modal1Start -and $i -le $modal1End) { continue }
    $newLines.Add($lines[$i])
  }
  $lines = $newLines.ToArray()
  Write-Host "After removal: $($lines.Count) lines"
}

# Now fix the stray )} — look for double )}
# Find pattern: line = "      )}" and next non-empty line = "      )}"
$newLines2 = [System.Collections.Generic.List[string]]::new()
$i = 0
while ($i -lt $lines.Count) {
  $line = $lines[$i]
  if ($line.Trim() -eq ')}') {
    # Check the next non-whitespace line
    $nextIdx = $i + 1
    while ($nextIdx -lt $lines.Count -and $lines[$nextIdx].Trim() -eq '') { $nextIdx++ }
    if ($nextIdx -lt $lines.Count -and $lines[$nextIdx].Trim() -eq ')}') {
      # Look at context to decide which one to remove
      # Check if previous lines close a modal (look for </div></div></div>)
      $prevContent = ""
      for ($k = [Math]::Max(0,$i-5); $k -lt $i; $k++) { $prevContent += $lines[$k] }
      if ($prevContent -match '</div>') {
        # This double )} is the stray one — skip the second
        Write-Host "Removing stray )} at line $($nextIdx+1) (after line $($i+1))"
        $newLines2.Add($line)
        $i = $nextIdx + 1  # skip the stray one
        continue
      }
    }
  }
  $newLines2.Add($line)
  $i++
}
$lines = $newLines2.ToArray()

# Save
[System.IO.File]::WriteAllLines($filePath, $lines, [System.Text.UTF8Encoding]::new($false))
Write-Host "Saved! Total lines: $($lines.Count)"
