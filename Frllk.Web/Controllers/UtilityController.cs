using Frllk.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;

namespace Frllk.Web.Controllers
{
    public class UtilityController : BaseController
    {
#if !DEBUG
        [OutputCache(Duration = int.MaxValue)]
#endif
        public ActionResult Html(string dir, string name)
        {
            string html = string.Format("~/App/views/{0}/{1}.html", dir, name);
            if (!System.IO.File.Exists(Server.MapPath(html)))
                return Content(string.Format("当前请求的页面“{0}”不存在！", html));
#if !DEBUG
            //Link http://www.cnblogs.com/dudu/archive/2012/08/27/asp_net_mvc_outputcache.html
            Response.Cache.SetOmitVaryStar(true);
#endif
            return File(html, "text/html; charset=utf-8");
        }
    }
}
