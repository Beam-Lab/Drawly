using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BeamLab.Drawly.Web.Hubs
{
    public class DrawHub : Hub
    {

        public Task Draw(string tooltype, int prevX, int prevY, int currentX, int currentY, string color, string size)
        {
            return Clients.Others.SendAsync(tooltype, prevX, prevY, currentX, currentY, color, size);
        }

    }
}
