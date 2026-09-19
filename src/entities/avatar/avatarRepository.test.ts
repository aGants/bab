import { describe, expect, it } from 'vitest'
import { defaultAvatar, toggleAccessory } from './avatarModel'
import { createLocalStorageAvatarRepository } from './avatarRepository'

describe('avatarRepository', () => {
  it('has nothing until the first save', async () => {
    expect(await createLocalStorageAvatarRepository().get()).toBeNull()
  })

  it('returns what was saved, across repository instances', async () => {
    const avatar = toggleAccessory({ ...defaultAvatar('tight'), faceId: 'wink' }, 'scarf')
    await createLocalStorageAvatarRepository().save(avatar)
    expect(await createLocalStorageAvatarRepository().get()).toEqual(avatar)
  })

  it('overwrites the previous avatar', async () => {
    const repo = createLocalStorageAvatarRepository()
    await repo.save(defaultAvatar('tight'))
    await repo.save(defaultAvatar('numb'))
    expect((await repo.get())?.headWordId).toBe('numb')
  })

  it('treats corrupt storage as empty instead of throwing', async () => {
    window.localStorage.setItem('avatar', '{not json')
    expect(await createLocalStorageAvatarRepository().get()).toBeNull()
  })

  it('sanitises stored data written by another version', async () => {
    window.localStorage.setItem(
      'avatar',
      JSON.stringify({ headWordId: 'sore', bodyId: 'removed-body', accessoryIds: ['removed-hat', 'glasses'] }),
    )
    expect(await createLocalStorageAvatarRepository().get()).toEqual({
      ...defaultAvatar('sore'),
      accessoryIds: ['glasses'],
    })
  })
})
