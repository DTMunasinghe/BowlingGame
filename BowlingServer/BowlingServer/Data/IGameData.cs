using BowlingServer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BowlingServer.Data
{
    public interface IGameData
    {
        List<Game> GetGames();

        Game GetGame(Guid id);

        Game AddGame(Game game);

        void DeleteGame(Game game);

        Game EditGame(Game game);
    }
}
