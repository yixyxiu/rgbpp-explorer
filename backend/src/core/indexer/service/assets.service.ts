import { BI, HashType, Script } from '@ckb-lumos/lumos';
import { computeScriptHash } from '@ckb-lumos/lumos/utils';
import { AssetType, PrismaClient } from '@prisma/client';
import { ITXClientDenyList } from '@prisma/client/runtime/library';
import { Cell } from 'src/core/blockchain/blockchain.interface';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

export class IndexerAssetsService {
  constructor(private prismaService: PrismaService) { }

  public async processAssetCell(
    chainId: number,
    cell: Cell,
    assetType: AssetType,
    tx: PrismaService | Omit<PrismaClient, ITXClientDenyList> = this.prismaService,
  ) {
    const { out_point, output, block_number } = cell;
    const lock: Script = {
      codeHash: output.lock.code_hash,
      hashType: output.lock.hash_type as HashType,
      args: output.lock.args,
    };

    const type: Script = {
      codeHash: output.type!.code_hash,
      hashType: output.type!.hash_type as HashType,
      args: output.type!.args,
    };

    const data = {
      chainId,
      blockNumber: BI.from(block_number).toNumber(),
      txHash: out_point.tx_hash,
      index: out_point.index,
      lockScriptHash: computeScriptHash(lock),
      typeScriptHash: computeScriptHash(type),
      assetTypeId: assetType.id,
    };

    return tx.asset.upsert({
      where: {
        chainId_txHash_index: {
          chainId,
          txHash: out_point.tx_hash,
          index: out_point.index,
        },
      },
      create: data,
      update: {},
    });
  }
}
