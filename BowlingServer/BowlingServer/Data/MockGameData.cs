using BowlingServer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BowlingServer.Data
{
    public class MockGameData : IGameData
    {
        private readonly List<Game> games = new List<Game>();

        public Game AddGame(Game game)
        {
            game.Id = Guid.NewGuid();
            game.CreatedAt = DateTime.Now;
            games.Add(game);
            return game;
        }

        public void DeleteGame(Game game)
        {
            throw new NotImplementedException();
        }

        public Game EditGame(Game game)
        {
            throw new NotImplementedException();
        }

        public Game GetGame(Guid id)
        {
            return games.SingleOrDefault(x => x.Id == id);
        }

        public List<Game> GetGames()
        {
            return games;
        }
    }
}
