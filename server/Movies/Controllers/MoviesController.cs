using Microsoft.AspNetCore.Mvc;
using Movies.Properties.BL;
using System.Linq.Expressions;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Movies.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {


        // GET api/movies
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(Movie.Read());
        }

        // POST api/movies
        [HttpPost]
        public IActionResult Post([FromBody] Movie m)
        {
            try
            {
                bool ok = Movie.Insert(m);
                if (!ok) return Conflict("Movie with the same Id already exists.");
                return Ok(m);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/movies/rating/8.5
        [HttpGet("rating")]
        public IActionResult GetMoviesByRating(double rating)
        {
            try
            {
                return Ok(Movie.ReadByRating(rating));
            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
        }

        // GET api/movies/duration?maxMinutes=120
        [HttpGet("duration")]
        public IActionResult GetByDuration([FromQuery] int duration)
        {
            try
            {
                return Ok(Movie.ReadByRating(duration));
            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
        }

    }


}
