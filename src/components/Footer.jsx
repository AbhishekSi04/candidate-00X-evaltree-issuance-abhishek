const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-gray-600 hover:text-primary transition-colors duration-200 font-body text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors duration-200 font-body text-sm">
              Terms of Use
            </a>
          </div>
          <div className="text-gray-600 font-body text-sm">© 2024 Evaltree. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
