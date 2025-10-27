{
  pkgs ? import <nixpkgs> { },
  projectName ? "project",
}:
let
  # Common shellHooks also for the toolkit itself
  shellHookCommon = ''
    export CHROMIUM_BIN=${lib.getExe pkgs.chromium}
    export FIREFOX_BIN=${lib.getExe pkgs.firefox}
    echo "🏁 Using Chromium at ${pkgs.chromium.version} and Firefox at ${pkgs.firefox.version} for tests"

    # Determine the repository root
    REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
  '';
  inherit (pkgs) lib;
in
pkgs.mkShell {
  # Common nativeBuildInputs for toolkit and apps
  nativeBuildInputs = with pkgs; [
    nodejs_22
    zellij # smart terminal workspace
    lazygit # git terminal
    just # task runner
    fzf # fuzzy finder, for "just watch"

    # Formatter for treefmt
    treefmt
    nodePackages.prettier
    nixfmt-rfc-style
    statix
    taplo
  ];

  # Common shellHooks also for the toolkit itself
  inherit shellHookCommon;

  # Specific shellHooks for the apps
  shellHook = shellHookCommon + ''
    # Check if we are in the repository root (and git is an actual folder and not part of a submodule);
    if [ "$REPO_ROOT" = "$(pwd)" ] && [ -d ".git" ]; then
      # Symlink the pre-commit hook into the .git/hooks directory
      echo "🛠️ Installing pre-commit hook"
      ln -sf ../../vendor/toolkit/shared/pre-commit.sh .git/hooks/pre-commit
    fi

    echo "💻 Starting ${lib.toSentenceCase projectName} dev shell"
  '';
}
