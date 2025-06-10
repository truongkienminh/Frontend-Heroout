import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
  return (
    <div className="bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 md:space-x-2">
            {items.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <svg
                    className="w-4 h-4 text-gray-400 mx-1 md:mx-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {item.href ? (
                  <Link
                    to={item.href}
                    className="text-gray-700 hover:text-emerald-600 transition-colors text-sm md:text-base"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={`text-gray-500 text-sm md:text-base ${
                      item.truncate ? "truncate max-w-xs md:max-w-md" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
