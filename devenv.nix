{
  # More config is provided by input shared
  enterShell = ''
    echo "🛠️ DBP Toolkit Dev Shell"
  '';

  # https://devenv.sh/git-hooks/
  git-hooks = {
    hooks = {
      # We need to do those with lerna
      eslint.enable = false;
      i18next.enable = false;

      # Our npm packages have different configs, so we need to use lerna to check
      lerna-check = {
        enable = true;
        name = "lerna-check";
        description = "Run check with lerna";
        entry = "npm run check";
        language = "system";
        pass_filenames = false;
        files = "(\\.js$|\\.json$)";
        stages = [ "pre-commit" ];
        require_serial = true;
      };
    };
  };
}
