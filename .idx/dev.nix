# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs }:

{
  # Use a supported Nix channel
  channel = "stable";

  # Declare required packages
  packages = [
    pkgs.nodejs_20
    pkgs.zulu
    pkgs.firebase-tools
  ];

  # Set environment variables
  env = {
    NODE_ENV = "development";
    FIREBASE_PROJECT = "demo-app";  # Change if you have a different project ID
  };

  # Enable Firebase Emulators
  services = {
    firebase = {
      emulators = {
        detect = true;
        projectId = "demo-app";  # Same here — replace if needed
        services = [ "auth" "firestore" ];
      };
    };
  };

  # Firebase Studio / IDX workspace enhancements
  idx = {
    # Add VS Code extensions from https://open-vsx.org/ (optional)
    extensions = [
      # "vscodevim.vim"
      # "esbenp.prettier-vscode"
    ];

    # Default workspace behavior
    workspace = {
      onCreate = {
        default.openFiles = [
          "src/app/page.tsx"
        ];
      };
    };

    # Enable web preview in Firebase Studio
    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "npx" "next" "dev" "--port" "$PORT" "--hostname" "0.0.0.0" ];
          manager = "web";
        };
      };
    };
  };
}
