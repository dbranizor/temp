# adb devices
# echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="22b8", MODE="0666", GROUP="plugdev"' | sudo tee /etc/udev/rules.d/51-android-usb.rules", MODE="0666", GROUP="plugdev"' | sudo tee /etc/udev/rules.d/51-android-usb.rules
# npx react-native run-android
# adb -s 0A071JECB02741 reverse tcp:9988 tcp:9988
# adb shell input keyevent 82

react-native unlink react-native-fs
npm uninstall react-native-fs
npm i react-native-fs --save
react-native link react-native-fs