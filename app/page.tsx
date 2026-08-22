export default function Home() {
  return (
    <div className="bg-gray-100 font-sans min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
          <h1 className="text-2xl font-bold">Global POS</h1>
          <p className="text-sm">By <span className="font-semibold">njangzaumun</span></p>
      </header>

      {/* Main POS Layout */}
      <main className="flex flex-col md:flex-row p-4 gap-4 h-[calc(100vh-80px)]">
          
          {/* Products Section (Left) */}
          <section className="w-full md:w-2/3 bg-white p-4 rounded-lg shadow overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Products</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* Product Card 1 */}
                  <div className="border rounded p-4 text-center hover:shadow-lg transition cursor-pointer bg-gray-50">
                      <div className="h-24 bg-gray-300 rounded mb-2 flex items-center justify-center text-gray-500">Image</div>
                      <h3 className="font-bold">Item 1</h3>
                      <p className="text-blue-600 font-semibold">$10.00</p>
                  </div>

                  {/* Product Card 2 */}
                  <div className="border rounded p-4 text-center hover:shadow-lg transition cursor-pointer bg-gray-50">
                      <div className="h-24 bg-gray-300 rounded mb-2 flex items-center justify-center text-gray-500">Image</div>
                      <h3 className="font-bold">Item 2</h3>
                      <p className="text-blue-600 font-semibold">$15.50</p>
                  </div>

                  {/* Product Card 3 */}
                  <div className="border rounded p-4 text-center hover:shadow-lg transition cursor-pointer bg-gray-50">
                      <div className="h-24 bg-gray-300 rounded mb-2 flex items-center justify-center text-gray-500">Image</div>
                      <h3 className="font-bold">Item 3</h3>
                      <p className="text-blue-600 font-semibold">$8.00</p>
                  </div>

              </div>
          </section>

          {/* Cart / Order Summary Section (Right) */}
          <section className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow flex flex-col justify-between">
              <div>
                  <h2 className="text-xl font-semibold mb-4 border-b pb-2">Current Order</h2>
                  
                  {/* Empty Cart Message */}
                  <div className="text-center text-gray-500 mt-10">
                      <p>No items added yet.</p>
                  </div>
              </div>

              {/* Total and Checkout */}
              <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-lg font-bold mb-4">
                      <span>Total:</span>
                      <span>$0.00</span>
                  </div>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded shadow transition">
                      Checkout
                  </button>
              </div>
          </section>

      </main>
    </div>
  );
}
