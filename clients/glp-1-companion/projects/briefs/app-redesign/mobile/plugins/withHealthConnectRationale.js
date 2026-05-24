/**
 * Config plugin: Health Connect permissions-rationale activity.
 *
 * Android Health Connect requires the app to respond to a rationale intent or
 * permission requests fail silently. This injects:
 *   - Android 13 and below: a rationale intent-filter on MainActivity
 *   - Android 14+:           a VIEW_PERMISSION_USAGE activity-alias
 *
 * Runs during `expo prebuild` — no manual AndroidManifest editing. If a future
 * react-native-health-connect release injects the rationale activity itself,
 * remove this plugin to avoid a duplicate-manifest-entry build error. After
 * prebuild, confirm both entries landed in
 * android/app/src/main/AndroidManifest.xml.
 */
const { withAndroidManifest } = require("@expo/config-plugins");

const RATIONALE_ACTION = "androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE";

module.exports = function withHealthConnectRationale(config) {
  return withAndroidManifest(config, (cfg) => {
    const app = cfg.modResults.manifest.application?.[0];
    if (!app) return cfg;

    // Find the launcher activity (MainActivity).
    const mainActivity = (app.activity || []).find((a) =>
      (a["intent-filter"] || []).some((f) =>
        (f.action || []).some(
          (act) => act.$["android:name"] === "android.intent.action.MAIN"
        )
      )
    );

    // Android 13-: rationale shown via a MainActivity intent filter.
    if (mainActivity) {
      mainActivity["intent-filter"] = mainActivity["intent-filter"] || [];
      const alreadyHasRationale = mainActivity["intent-filter"].some((f) =>
        (f.action || []).some((act) => act.$["android:name"] === RATIONALE_ACTION)
      );
      if (!alreadyHasRationale) {
        mainActivity["intent-filter"].push({
          action: [{ $: { "android:name": RATIONALE_ACTION } }],
        });
      }
    }

    // Android 14+: dedicated activity-alias.
    app["activity-alias"] = app["activity-alias"] || [];
    const aliasName = "ViewPermissionUsageActivity";
    const aliasExists = app["activity-alias"].some(
      (a) => a.$["android:name"] === aliasName
    );
    if (!aliasExists) {
      app["activity-alias"].push({
        $: {
          "android:name": aliasName,
          "android:exported": "true",
          "android:targetActivity": ".MainActivity",
          "android:permission": "android.permission.START_VIEW_PERMISSION_USAGE",
        },
        "intent-filter": [
          {
            action: [
              { $: { "android:name": "android.intent.action.VIEW_PERMISSION_USAGE" } },
            ],
            category: [
              { $: { "android:name": "android.intent.category.HEALTH_PERMISSIONS" } },
            ],
          },
        ],
      });
    }

    return cfg;
  });
};
