const Header = ({ title }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6">
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
    </header>
  );
};

export default Header;
