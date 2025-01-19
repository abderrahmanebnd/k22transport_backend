class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.totalDocs = 0;
    this.limit = process.env.PAGE_SIZE;
    this.page = 1;
  }

  async setTotalDocs(Model) {
    this.totalDocs = await Model.countDocuments();
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    this.page = this.queryString.page * 1 || 1;
    this.limit = this.queryString.limit * 1 || process.env.PAGE_SIZE;
    const skip = (this.page - 1) * this.limit;

    this.query = this.query.skip(skip).limit(this.limit);

    return this;
  }

  getPaginationDetails() {
    const totalPages = Math.ceil(this.totalDocs / this.limit);
    return {
      total: this.totalDocs,
      currentPage: this.page,
      totalPages,
      next: this.page < totalPages,
      prev: this.page > 1,
      pageSize: process.env.PAGE_SIZE,
    };
  }
}

module.exports = APIFeatures;
