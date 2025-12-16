# Commands to fix iOS build issues:

# 1. Switch to Xcode developer directory (requires sudo)
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer

# 2. Accept Xcode license
sudo xcodebuild -license accept

# 3. Clean CocoaPods cache and reinstall
cd ios && pod cache clean --all
rm -rf Pods Podfile.lock
pod install

# 4. Clean and rebuild
cd ..
npx react-native run-ios --simulator='iPhone 14'
