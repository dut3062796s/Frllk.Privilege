using System.Web;
using System.Web.Optimization;

namespace Frllk.Web
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/js/base/library").Include(
                 "~/app/vendor/jquery-1.11.2.min.js",
                 "~/app/vendor/angular/angular.js",
                 "~/app/vendor/angular/angular-route.js",
                 "~/app/vendor/bootstrap/js/ui-bootstrap-tpls-0.12.1.min.js",
                 "~/app/vendor/bootstrap-notify/bootstrap-notify.min.js"
                ));

            bundles.Add(new ScriptBundle("~/js/angularjs/app").Include(
                "~/app/scripts/services/*.js",
                "~/app/scripts/controllers/*.js",
                "~/app/scripts/directives/*.js",
                "~/app/scripts/filters/*.js",
                "~/app/scripts/app.js"));
        }
    }
}