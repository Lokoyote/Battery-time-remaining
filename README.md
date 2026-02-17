# Gnome Shell Extension - Battery Time Remaining

This extension modifies the existing battery indicator in the top bar to display both the percentage AND the remaining time in the following format: **% (HH:mm)**

Example: `85% (2:34)` or `45% (1:15)`

## How it Works

When you enable the extension:

* The battery percentage is automatically enabled (if it wasn't already).
* The remaining time is added next to the percentage.
* The display integrates directly into the existing battery indicator (icon + text).

When you disable the extension:

* The percentage display setting returns to its original state.
* The standard battery display is restored.

## Installation

1. Create the extension directory:

```bash
mkdir -p ~/.local/share/gnome-shell/extensions/battery-time-remaining@lokoyote.eu

```

2. Copy the files into this folder:

```bash
cp metadata.json extension.js stylesheet.css ~/.local/share/gnome-shell/extensions/battery-time-remaining@glokoyote.eu/

```

3. Restart Gnome Shell:
* On X11: Press `Alt+F2`, type `r`, and press Enter.
* On Wayland: Log out and log back in.


4. Enable the extension:

```bash
gnome-extensions enable battery-time-remaining@lokoyote.eu

```

Or use the "Extensions" app (gnome-extensions-app).

## Display Examples

* **Discharging**: `73% (3:45)` – 3h45 of battery life remaining.
* **Charging**: `45% (1:20)` – 1h20 remaining until fully charged.
* **Fully Charged**: `100%` – no time displayed.

## Uninstallation

```bash
gnome-extensions disable battery-time-remaining@lokoyote.eu
rm -rf ~/.local/share/gnome-shell/extensions/battery-time-remaining@lokoyote.eu

```

Restart Gnome Shell to return everything to normal.

## Compatibility

Compatible with Gnome Shell 46 and 47.

## Credits

This extension is a modified version of the [Battery Time](https://extensions.gnome.org/extension/1475/battery-time/) extension.
