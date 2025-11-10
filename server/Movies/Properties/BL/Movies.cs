namespace Movies.Properties.BL
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public double Rating { get; set; }
        public double Income { get; set; }
        public int Duration { get; set; }
        public string Language { get; set; }

        public string Description { get; set; }
        public string Director { get; set; }
        public int ReleaseYear { get; set; }
        public string Genre { get; set; }
        public string PhotoURL { get; set; }


        public static List<Movie> movies = new List<Movie>();

        public bool Insert(Movie m)
        {
            try
            {
                foreach (Movie movie in movies)
                {
                    if (m.Id == Id)
                    {
                        return false; // Movie with the same Id already exists

                    }
                }
                movies.Add(this);
                return true;

            }
            catch (Exception ex)
            {
                return false;


            }
        }
        public static List<Movie> Read()
        {
            return movies;
        }
    }
}
