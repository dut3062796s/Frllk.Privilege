using System.Web.Mvc;
using Frllk.Web;

namespace Frllk.Web.Controllers
{

    public class IndexController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}
