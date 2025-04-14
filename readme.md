# Logseq Todo Plugin

A simple to-do list plugin for logseq

> This plugin relies solely on the Logseq Plugin API to access local data, and does not store it externally.

<a href="https://www.buymeacoffee.com/yuexunjiang"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=yuexunjiang&button_colour=FFDD00&font_colour=000000&font_family=Comic&outline_colour=000000&coffee_colour=ffffff" /></a>

### Features
- Quickly add new to-do items to today's journal page.
- View all of today's to-do items (include scheduled & today's journal page).
- View all to-do items without a schedule.
- Ignore to-do items on a specified page.

![](./screenshots/plugin-panel.png)

![](./screenshots/plugin-settings.png)

## Install

### Option 1: directly install via Marketplace

### Option 2: manually load

- turn on Logseq developer mode
- [download the prebuilt package here](https://github.com/ahonn/logseq-plugin-todo/releases)
- unzip the zip file and load from Logseq plugins page

## How to use

- Pin the plugin to the top bar
- Now To-do items can be easily created or edited from the menu bar through the dedicated icon.
- To set task priority (options are `A`=HIGH, `B`=MEDIUM, `C`=LOW), add `[#A]` to your marker. For example, `TODO [#C] text`.

## Page Properties

- `todo-ignore`: Whether to hide the todo task in the current page. see [How to use todo-ignore #8](https://github.com/ahonn/logseq-plugin-todo/issues/8)

## Contribution
Issues and PRs are welcome!

## Licence
MIT
