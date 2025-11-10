namespace Movies.Properties.BL
{
    public class Cast
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Role { get; set; }

        public string Country { get; set; }
        public DateTime DateOfBirth { get; set; }


        public static List<Cast> CastList = new List<Cast>();

        public bool Insert(Cast c)
        {
            try
            {
                foreach (Cast cast in CastList)
                {
                    if (c.Id == Id)
                    {
                        return false; 

                    }
                }
                CastList.Add(this);
                return true;

            }
            catch (Exception ex)
            {
                return false;


            }
        }
        public static List<Cast> Read()
        {
            return CastList;
        }
    }
}
