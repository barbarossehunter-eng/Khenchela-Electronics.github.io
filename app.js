document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("tableBody");
    const searchInput = document.getElementById("searchInput");
    const lastUpdated = document.getElementById("lastUpdated");
    
    // وضع تاريخ اليوم كتاريخ لآخر تحديث
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    lastUpdated.textContent = "آخر تحديث: " + today.toLocaleDateString('ar-DZ', options);

    let productsData = [];

    // جلب البيانات من ملف JSON
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            productsData = data;
            renderTable(productsData);
        })
        .catch(error => {
            console.error("خطأ في جلب البيانات:", error);
            tableBody.innerHTML = "<tr><td colspan='4' style='text-align:center; color:red;'>عذراً، حدث خطأ في تحميل الأسعار.</td></tr>";
        });

    // دالة رسم الجدول
    function renderTable(data) {
        tableBody.innerHTML = ""; // تفريغ الجدول القديم
        
        data.forEach(product => {
            const row = document.createElement("tr");
            
            // تحديد لون حالة التوفر
            let statusClass = "status-available";
            if (product.status.includes("غير")) statusClass = "status-unavailable";
            else if (product.status.includes("محدود")) statusClass = "status-limited";

            row.innerHTML = `
                <td><strong>${product.name}</strong></td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td class="${statusClass}">${product.status}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // خاصية البحث الفوري
    searchInput.addEventListener("keyup", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        const filteredData = productsData.filter(product => {
            return product.name.toLowerCase().includes(searchTerm) || 
                   product.category.toLowerCase().includes(searchTerm);
        });
        
        renderTable(filteredData);
    });
});