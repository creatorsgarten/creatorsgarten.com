import fs from 'fs'
import path from 'path'

import { getHash } from './getHash'
import { contentsgarten } from '$constants/contentsgarten'

import type { ContentsgartenOutput } from '$types/ContentsgartenOutput'

type TRPCResponse = ContentsgartenOutput['view']
interface MarkdownResponse<T = Record<string, string>>
  extends Omit<TRPCResponse, 'frontMatter'> {
  frontMatter: T
}

const cacheDirectory = path.join(process.cwd(), '.cache')
const maxAge = 60 * 1000

export const getMarkdownFromSlug = async <Frontmatter = Record<string, string>>(
  slug: string
): Promise<MarkdownResponse<Frontmatter>> => {
  // get file hash
  const now = Date.now()
  const cacheKey = getHash(['wiki', slug])
  const requestedDirectory = path.join(cacheDirectory, cacheKey)

  try {
    const files = await fs.promises.readdir(requestedDirectory)

    for (const file of files) {
      const [maxAgeString, expireAtString, etag, extension] = file.split('.')
      const filePath = path.join(requestedDirectory, file)
      const expireAt = Number(expireAtString)

      if (expireAt < now) {
        await fs.promises.rm(filePath)
      } else {
        const cachedMarkdownResponse = await fs.promises
          .readFile(path.join(requestedDirectory, file), 'utf8')
          .then(o => JSON.parse(o) as MarkdownResponse<Frontmatter>)

        return cachedMarkdownResponse
      }
    }

    throw new Error('cache-miss')
  } catch (e) {
    const fetchedMarkdownResponse = (await contentsgarten.view.query({
      pageRef: slug,
      withFile: true,
      revalidate: true,
      render: true,
    })) as MarkdownResponse<Frontmatter>

    if (fetchedMarkdownResponse.status === 200) {
      const targetFileName = `${maxAge}.${maxAge + Date.now()}.${getHash([
        JSON.stringify(fetchedMarkdownResponse),
      ])}.json`

      // any case of failure (maybe due to filesystem space ran out) can be ignored,
      // but it need to make sure it properly cleaned up
      try {
        await fs.promises.mkdir(requestedDirectory, { recursive: true })
        await fs.promises.writeFile(
          path.join(requestedDirectory, targetFileName),
          JSON.stringify(fetchedMarkdownResponse)
        )
      } catch (e) {
        await fs.promises
          .rm(path.join(requestedDirectory, targetFileName))
          .catch(() => {})
      }
    }
    return fetchedMarkdownResponse
  }
}
