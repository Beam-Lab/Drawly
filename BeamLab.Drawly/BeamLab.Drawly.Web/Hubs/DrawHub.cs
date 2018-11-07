using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BeamLab.Drawly.Web.Hubs
{
    public class DrawHub : Hub
    {
        static List<KeyValuePair<string, string>> OnlineUsers = new List<KeyValuePair<string, string>>();

        public Task JoinWhiteboard(string whiteboard)
        {
            var count = 0;

            if (OnlineUsers.Count(c => c.Value == Context.ConnectionId) == 0)
            {
                var newUser = new KeyValuePair<string, string>(whiteboard, Context.ConnectionId);

                OnlineUsers.Add(newUser);

                count = OnlineUsers.Where(c => c.Key == whiteboard).Count();

                Groups.AddToGroupAsync(Context.ConnectionId, whiteboard);

                SendUpdateUsersCount(whiteboard, count.ToString());
            }

            return Task.CompletedTask;
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            var whiteboard = OnlineUsers.Where(c => c.Value == Context.ConnectionId).FirstOrDefault().Key;
            var count = OnlineUsers.Where(c => c.Key == whiteboard).Count() - 1;

            OnlineUsers.Remove(OnlineUsers.Where(c => c.Value == Context.ConnectionId).FirstOrDefault());

            SendUpdateUsersCount(whiteboard, count.ToString());

            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendUpdateUsersCount(string whiteboard, string count)
        {
            await Clients.Group(whiteboard).SendAsync("updateonlineusers", count);
        }

        public Task Draw(string tooltype, int prevX, int prevY, int currentX, int currentY, string color, string size)
        {
            return Clients.Others.SendAsync(tooltype, prevX, prevY, currentX, currentY, color, size);
        }

    }
}
