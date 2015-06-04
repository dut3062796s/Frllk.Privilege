using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Frllk.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            //angularjs 视图请求地址
            routes.MapRoute("Views", "{dir}-{name}",
                new { controller = "Utility", action = "Html" });
            //普通控制器请求
            routes.MapRoute("Default", "{controller}/{action}/{id}",
                new { controller = "Index", action = "Index", id = UrlParameter.Optional });
        }
    }
}