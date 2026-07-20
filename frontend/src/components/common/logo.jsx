function Logo() {
    return (
        <div className="d-flex align-items-center gap-3">
            <div
                className="bg-primary rounded d-flex justify-content-center align-items-center"
                style={{ width: "40px", height: "40px" }}
            >
                <i className="bi bi-airplane text-white"></i>
            </div>

            <div>
                <h5 className="mb-0 fw-bold">Rang Travels</h5>
                <small className="text-muted">CRM SUITE</small>
            </div>
        </div>
    );
}

export default Logo;