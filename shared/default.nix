{
  pkgs ? import <nixpkgs> { },
}:
let
  # Common shellHooks also for the toolkit itself
  shellHookCommon = ''
    export CHROMIUM_BIN=${pkgs.chromium}/bin/chromium
    export FIREFOX_BIN=${pkgs.firefox}/bin/firefox
    echo "🏁 Using chromium at $CHROMIUM_BIN and firefox at $FIREFOX_BIN for karma tests"

    # Determine the repository root
    REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
  '';
in
pkgs.mkShell {
  # Common nativeBuildInputs for toolkit and apps
  nativeBuildInputs = with pkgs; [
    nodejs_22
    zellij # smart terminal workspace
    lazygit # git terminal
    just # task runner
    fzf # fuzzy finder, for "just watch"
  ];

  # Common shellHooks also for the toolkit itself
  shellHookCommon = shellHookCommon;

  # Specific shellHooks for the apps
  shellHook =
    shellHookCommon
    + ''
      # Check if we are in the repository root (and git is an actual folder and not part of a submodule);
      if [ "$REPO_ROOT" = "$(pwd)" ] && [ -d ".git" ]; then
        # Symlink the pre-commit hook into the .git/hooks directory
        echo "🛠️ Installing pre-commit hook"
        ln -sf ../../vendor/toolkit/shared/pre-commit.sh .git/hooks/pre-commit
      fi
    '';
}
