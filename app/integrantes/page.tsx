// app/integrantes/page.jsx
import Link from "next/link";
import Image from "next/image";

export default function Integrantes() {
  const teamMembers = [
    {
      name: "Davi Vasconcelos Souza",
      rm: "559906",
      image: "/davi.jpg",
      github: "https://github.com/davivsouza",
      linkedin: "https://linkedin.com/in/davi-dev/",
    },
    {
      name: "Lucas Manfredini",
      rm: "559677",
      image: "/lucas.jpg",
      github: "https://github.com/LucasManfredini",
      linkedin: "https://www.linkedin.com/in/lucasmanfredinicordeirovaz/",
    },
    {
      name: "Leonardo Carvalho Jeronimo",
      rm: "560380",
      image: "/leonardo.jpg",
      github: "https://github.com/Leocarvalhosx",
      linkedin: "https://www.linkedin.com/in/leonardo-carvalho-974832275",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8" role="main">
        <h2 id="grupo-titulo" className="text-2xl font-bold text-center mb-8">
          Nosso Grupo - Turma 1TDSZ
        </h2>

        <ul
          aria-labelledby="grupo-titulo"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {teamMembers.map((member, index) => (
            <li
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center p-4"
            >
              <div className="relative w-40 h-40 mb-4">
                <Image
                  src={member.image}
                  alt={`Foto do integrante ${member.name}`}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <p className="font-medium text-center mb-2">
                {member.name} - RM: {member.rm}
              </p>
              <div className="flex space-x-4 mt-2">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`GitHub do ${member.name.split(" ")[0]}`}
                  className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                >
                  GitHub
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn do ${member.name.split(" ")[0]}`}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  LinkedIn
                </a>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer
        className="bg-gray-800 text-white p-4 text-center"
        role="contentinfo"
      >
        <p>
          &copy; {new Date().getFullYear()} ConectaTrens. Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  );
}
