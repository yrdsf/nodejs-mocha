using netnunit.Controllers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Net.Http;
using System.Web.Http;

namespace netnunit.Tests
{
    [TestClass]
    public class ProductTest
    {
        [TestMethod]
        public void TestCase()
        {
            var controller = new ProductController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            var response = controller.Get();

            Assert.AreEqual("Hello", response[0]);
        }
    }
}
