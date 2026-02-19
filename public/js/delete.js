document.querySelectorAll(".delete-btn").forEach(btn=>{
btn.addEventListener("click",async()=>{
    const id=btn.dataset.id;
    if(!confirm('Delete this book?')) return;
    await fetch(`/books/${id}`, {method:"DELETE"});
    location.reload();
    });
});