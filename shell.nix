{
  pkgs ? import <nixpkgs> { },
}:
let
  config = import ./shared { inherit pkgs; };
in
pkgs.mkShell {
  nativeBuildInputs =
    config.nativeBuildInputs
    ++ (with pkgs; [
    ]);

  shellHook =
    config.shellHookCommon
    + ''
      # Check if we are in the repository root (and git is an actual folder and not part of a submodule);
      if [ "$REPO_ROOT" = "$(pwd)" ] && [ -d ".git" ]; then
        # Symlink the pre-commit hook into the .git/hooks directory
        echo "🛠️ Installing pre-commit hook"
        ln -sf ../../shared/pre-commit.sh .git/hooks/pre-commit
      fi
    '';
}
