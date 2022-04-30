module.exports = {
  branches: ["master"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
      },
    ],
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
      },
    ],
    "@semantic-release/git",
    [
      "@semantic-release/exec",
      {
        prepareCmd:
          "zip -qq -r logseq-plugin-todo-${nextRelease.version}.zip dist readme.md LICENSE package.json logo.svg",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: "logseq-plugin-todo-*.zip",
      },
    ],
  ],
};
