!define PROJROOT "${__FILEDIR__}\.."
!include "MUI2.nsh"

; ... (صفحات و تنظیمات مثل قبل)

Section "Install"
  ; همه‌چیز را از استیج به Program Files کپی کن
  SetOutPath "$INSTDIR"
  File /r "${PROJROOT}\dist\app\*.*"

  ; اگر WebView2 نصب نیست و فایلش در $INSTDIR هست، سایلنت نصب کن
  Call IsWebView2Installed
  Pop $0
  StrCmp $0 "1" +4 0
    IfFileExists "$INSTDIR\WebView2Setup.exe" 0 +2
      ExecWait '"$INSTDIR\WebView2Setup.exe" /silent /install'

  ; لانچر (CWD = AppData)
  SetOutPath "$INSTDIR"
  FileOpen $2 "$INSTDIR\run-monitoring.cmd" w
  FileWrite $2 "@echo off$\r$\n"
  FileWrite $2 "cd /d $\"%APPDATA%\monitoring-with-go$\"$\r$\n"
  FileWrite $2 "$\"%~dp0monitoring-with-go.exe$\"$\r$\n"
  FileClose $2

  ; شورتکات‌ها ← لانچر
  CreateShortCut "$SMPROGRAMS\monitoring-with-go.lnk" "$INSTDIR\run-monitoring.cmd"
  CreateShortCut "$DESKTOP\monitoring-with-go.lnk"     "$INSTDIR\run-monitoring.cmd"

  ; Uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"

  ; اجرا پس از نصب
  Exec "$INSTDIR\run-monitoring.cmd"
SectionEnd

; تشخیص WebView2 (مثل قبل)
Function IsWebView2Installed
  StrCpy $0 "0"
  ReadRegStr $1 HKLM "SOFTWARE\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" "pv"
  StrCmp $1 "" 0 +3
    ReadRegStr $1 HKLM "SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" "pv"
  StrCmp $1 "" +2 0
    StrCpy $0 "1"
FunctionEnd

Section "Uninstall"
  Delete "$SMPROGRAMS\monitoring-with-go.lnk"
  Delete "$DESKTOP\monitoring-with-go.lnk"
  Delete "$INSTDIR\Uninstall.exe"
  Delete "$INSTDIR\run-monitoring.cmd"
  RMDir /r "$APPDATA\monitoring-with-go"
  RMDir /r "$INSTDIR"
SectionEnd
