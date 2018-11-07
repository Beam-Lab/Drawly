using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BeamLab.Drawly.Web.Controllers
{
    [Route("w")]
    public class WhiteBoardController : Controller
    {
        [HttpPost]
        [Route("CreateWhiteBoard")]
        public IActionResult CreateWhiteBoard()
        {
            Guid whiteboardGuid = Guid.NewGuid();

            return this.RedirectToAction("Viewer", new { whiteboard = whiteboardGuid });
        }

        [Route("viewer")]
        public IActionResult Viewer()
        {
            return View();
        }
    }
}
