call ionic config set dev_push false
call ionic cordova build android
call ionic config set dev_push true
call explorer.exe "platforms\android\build\outputs\apk"