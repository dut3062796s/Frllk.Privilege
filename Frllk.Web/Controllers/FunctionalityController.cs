using Frllk.Interfaces;
using Frllk.Services;
using Frllk.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Frllk.Web.Controllers
{
    public class FunctionalityController : ApiController
    {
        public IFunctionality Service { get; set; }
        public FunctionalityController()
        {
            Service = new FunctionalityService();
        }
        public ResultBase Get([FromUri]PageParams param)
        {
            return Service.Get(param);
        }
        public ResultBase Put(FunctionalityDetails model)
        {
            return Service.Put(model);
        }
        public ResultBase Post(FunctionalityDetails model)
        {
            return Service.Post(model);
        }
        public ResultBase Delete(int id)
        {
            return Service.Delete(id);
        }
    }
}
