import {
    Extension as BaseExtension,
    InjectionManager
} from 'resource:///org/gnome/shell/extensions/extension.js';
import {panel} from 'resource:///org/gnome/shell/ui/main.js';
import {Indicator} from 'resource:///org/gnome/shell/ui/status/system.js';
import UPower from 'gi://UPowerGlib';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

/**
 * Logic to calculate time and percentage
 * This replaces the default GNOME behavior for the power menu item
 */
const _powerToggleSyncOverride = function () {
    // 1. Check if a battery or UPS is actually present
    this.visible = this._proxy.IsPresent;
    if (!this.visible) return false;

    let seconds = 0;
    let state = this._proxy.State;
    // Get the battery percentage and round it (e.g., 85.4% -> 85%)
    let percentage = Math.round(this._proxy.Percentage);

    // 2. Determine if we are charging or discharging to get the right time
    if (state === UPower.DeviceState.CHARGING) {
        seconds = this._proxy.TimeToFull;
    } else if (state === UPower.DeviceState.DISCHARGING) {
        seconds = this._proxy.TimeToEmpty;
    }

    // 3. If time is 0 (calculating), fallback to default GNOME display
    if (seconds === 0) return false;

    // 4. Convert seconds into hours and minutes
    let time = Math.round(seconds / 60);
    let minutes = time % 60;
    let hours = Math.floor(time / 60);

    // 5. Format the final string: "Hours:Minutes (Percentage%)"
    // Use %% to display a literal '%' sign in the format function
    this.title = _('%d\u2236%02d (%d%%)').format(hours, minutes, percentage);

    return true;
};

export default class Extension extends BaseExtension {
    enable() {
        // Initialize the manager that handles our code "injections"
        this._im = new InjectionManager();

        // Override the original GNOME '_sync' method to use our custom logic
        this._im.overrideMethod(Indicator.prototype, '_sync', function (_sync) {
            return function () {
                const {powerToggle} = this._systemItem;
                
                // Run our custom calculation
                const hasOverride = _powerToggleSyncOverride.call(powerToggle);
                
                // Call the original GNOME sync method to keep everything else working
                _sync.call(this);
                
                // Ensure our custom label stays visible
                if (hasOverride) {
                    this._percentageLabel.visible = true;
                }
            };
        });

        // Force a refresh immediately when the extension starts
        this._syncToggle();
    }

    disable() {
        // Clean up: remove our modifications and restore GNOME's original behavior
        this._im?.clear();
        this._im = null;
        
        // Refresh to show the original percentage label
        this._syncToggle();
    }

    /**
     * Helper to tell GNOME to redraw the power indicator
     */
    _syncToggle() {
        const powerToggle = panel.statusArea?.quickSettings?._system?._systemItem?.powerToggle;
        if (powerToggle && typeof powerToggle._sync === 'function') {
            powerToggle._sync();
        }
    }
}
