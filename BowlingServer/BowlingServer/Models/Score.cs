using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BowlingServer.Models
{
    public class Score
    {
        public Guid Id { get; set; }

        public Guid GameId { get; set; }

        public int LaneId { get; set; }

        public int TotalScore { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
