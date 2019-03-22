using netnunit.Controllers;
using NUnit.Framework;
using System;
using System.Net.Http;
using System.Web.Http;

namespace netnunit.Tests
{
    [TestFixture()]
    public class ProductTest
    {
        [Test()]
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
