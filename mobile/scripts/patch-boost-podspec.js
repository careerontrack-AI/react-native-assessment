const fs = require("fs");
const path = require("path");

const podspecPath = path.join(
  __dirname,
  "../node_modules/react-native/third-party-podspecs/boost.podspec"
);

if (fs.existsSync(podspecPath)) {
  let content = fs.readFileSync(podspecPath, "utf8");

  // Target URL to use (direct download from archives.boost.io)
  const targetUrl =
    "https://archives.boost.io/release/1.76.0/source/boost_1_76_0.tar.bz2";

  // Check if already patched correctly (look for the correct prepare_command pattern)
  const prepareCommandMarker = "mv boost_1_76_0/boost";
  if (content.includes(prepareCommandMarker) && content.includes(targetUrl)) {
    return;
  }

  // Replace any URL containing boost_1_76_0.tar.bz2 with the working URL
  const urlPattern = /https?:\/\/[^'"]+boost_1_76_0\.tar\.bz2[^'"]*/g;
  let wasPatched = false;

  if (urlPattern.test(content)) {
    content = content.replace(urlPattern, targetUrl);
    wasPatched = true;
  }

  // Add or update prepare_command to properly extract boost from the archive
  // CocoaPods extracts to boost_1_76_0/, but we need boost/ at the root
  const correctPrepareCommand = `  spec.prepare_command = <<-CMD
    # Move boost directory from boost_1_76_0/boost to boost/
    if [ -d "boost_1_76_0" ]; then
      mv boost_1_76_0/boost .
      rm -rf boost_1_76_0
    fi
CMD
`;

  // Check if prepare_command exists and needs updating
  if (content.includes("spec.prepare_command")) {
    // Replace existing prepare_command if it's incorrect
    if (!content.includes(prepareCommandMarker)) {
      const prepareCommandPattern = /(\s+spec\.prepare_command\s*=.*?CMD\n)/s;
      if (prepareCommandPattern.test(content)) {
        content = content.replace(prepareCommandPattern, correctPrepareCommand);
        wasPatched = true;
      }
    }
  } else {
    // Add prepare_command before preserve_path
    const preservePathPattern = /(\s+spec\.preserve_path\s*=\s*['"]boost['"])/;
    if (preservePathPattern.test(content)) {
      content = content.replace(
        preservePathPattern,
        correctPrepareCommand + "$1"
      );
      wasPatched = true;
    }
  }

  if (wasPatched) {
    fs.writeFileSync(podspecPath, content, "utf8");
    console.log("✅ Patched boost.podspec with URL and prepare_command");
  } else if (content.includes(targetUrl)) {
    console.log("✅ boost.podspec URL already patched");
  } else {
    console.log("⚠️  Could not find boost URL in boost.podspec");
  }
} else {
  console.log("⚠️  boost.podspec not found, skipping patch");
}
