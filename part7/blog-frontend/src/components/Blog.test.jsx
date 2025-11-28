import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

test("renders blog title and author", () => {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "http://testblog.com",
  }
  render(<Blog blog={blog} />);
  const authorElement = screen.getByText("Test Blog by Test Author");
  expect(authorElement).toBeInTheDocument();
})

test('clicking twice the like button calls event handler twice', async () => {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "http://testblog.com",
    likes: 0,
  }
  const mockHandler = vi.fn();
  render(<Blog blog={blog} handleLike={mockHandler} />);
  const likeButton = screen.getByText("like");
  await userEvent.click(likeButton);
  await userEvent.click(likeButton);
  expect(mockHandler.mock.calls).toHaveLength(2);
})

