export function isOverlapping(
    existingStart: Date,
    existingEnd: Date,
    requestedStart: Date,
    requestedEnd: Date
  ): boolean {
    return existingStart < requestedEnd && existingEnd > requestedStart;
  }