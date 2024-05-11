import Link from 'next/link';

const Custom404 = () => {
  return (
    <div className="bg-white h-screen items-center justify-center">
      <div className="page_404">
              <div className="col-sm-10 col-sm-offset-1 text-center">
                <div className="four_zero_four_bg">
                  <h1 className="text-center text-gray-600">404</h1>
                </div>
                <div className="contant_box_404">
                  <h3 className="text-lg text-gray-600">
                    Looks like you're lost
                  </h3>
                  <p className='text-md text-gray-600 mb-2'>the page you are looking for is not available!</p>
                  <Link href='/'><button className="bg-green-700 text-white py-2 px-4 text-xs rounded-md">Go to Home</button></Link>
                </div>
              </div>
          </div>
      </div>
  );
};

export default Custom404;
