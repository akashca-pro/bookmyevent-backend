/**
 * Data Transfer Object (DTO) representing pagination information.
 *
 * @interface
 */
export interface PaginationDTO<T> {
  /**
   * The body of the response, representing the paginated data.
   */
  body: T[]

  /**
   * The total number of all items.
   */
  total: number

  /**
   * The current page number.
   */
  page: number

  /**
   * The limit
   */
  limit: number
}
