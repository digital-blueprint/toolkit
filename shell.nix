{
  pkgs ? import <nixpkgs> { },
}:
pkgs.mkShell {
  # nativeBuildInputs is usually what you want -- tools you need to run
  nativeBuildInputs = with pkgs; [
    nodejs_22
    curl
    zellij # smart terminal workspace
    lazygit # git terminal
    just # task runner
    fzf # fuzzy finder, for "just watch"
    chromium # for karma tests
    firefox # for karma tests
  ];

  shellHook = ''
    export CHROMIUM_BIN=${pkgs.chromium}/bin/chromium
    export FIREFOX_BIN=${pkgs.firefox}/bin/firefox

    echo "Using chromium at $CHROMIUM_BIN and firefox at $FIREFOX_BIN for karma tests"
  '';
}
