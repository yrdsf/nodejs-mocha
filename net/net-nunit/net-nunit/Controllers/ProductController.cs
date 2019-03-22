using System;
using System.Web.Http;

namespace netnunit.Controllers
{
    public class ProductController : ApiController
    {
        public ProductController()
        {

        }

        public string[] Get()
        {
            return new string[]
            {
                "Hello",
                "World"
            };
        }
    }
}
